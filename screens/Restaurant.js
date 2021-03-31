import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';

import {COLORS, FONTS, icons, images, SIZES} from '../constant';
import {isIphoneX} from 'react-native-iphone-x-helper';
const Restaurant = ({route, navigation}) => {
  const [restaurant, setRestaurant] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [orderItem, setOrderItem] = useState([
    // {menuId: 2, items: 1, totalPrice: 10, price: 10},
  ]);

  const scrollX = new Animated.Value(0);
  useEffect(() => {
    const {item, currentLocation} = route.params;
    setCurrentLocation(currentLocation);
    setRestaurant(item);
  }, []);

  const filterItem = (menuId) => {
    const item = orderItem.filter((fitem) => fitem.menuId === menuId);
    if (item.length > 0) {
      return item[0].items;
    } else {
      return 0;
    }
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          marginTop: SIZES.padding * 1.5,
        }}>
        <TouchableOpacity
          style={{
            width: 50,
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              backgroundColor: COLORS.lightGray3,
              width: '70%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: SIZES.padding * 3,
              borderRadius: SIZES.radius,
            }}>
            <Text>{restaurant?.name}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            width: 50,
            paddingRight: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Image
            source={icons.list}
            resizeMode="contain"
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderScrollView = () => {
    const editOrder = (action, menuid, price) => {
      const orderList = orderItem.slice();
      const orderitem = orderList.filter((fitem) => {
        return fitem.menuId === menuid;
      });
      if (action === '+') {
        if (orderitem.length > 0) {
          const price = orderitem[0].price;
          const orderitems = orderitem[0].items;
          orderitem[0].items = orderitems + 1;
          orderitem[0].totalPrice = price * orderitem[0].items;
          setOrderItem(orderList);
        } else {
          setOrderItem([
            ...orderItem,
            {menuId: menuid, items: 1, totalPrice: price, price: price},
          ]);
        }
      } else {
        if (orderitem.length > 0) {
          if (orderitem[0].items <= 0) {
            orderitem[0].items = 0;
            orderitem[0].totalPrice = price * orderitem[0].items;
            setOrderItem(orderList);
          } else {
            const price = orderitem[0].price;
            const orderitems = orderitem[0].items;
            orderitem[0].items = orderitems - 1;
            orderitem[0].totalPrice = price * orderitem[0].items;
            setOrderItem(orderList);
          }
        }
      }
    };

    return (
      <Animated.ScrollView
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}>
        {restaurant?.menu.map((arr, index) => (
          <View key={`menu${index}`} style={{alignItems: 'center'}}>
            <View style={{height: SIZES.height * 0.35}}>
              <Image
                source={arr.photo}
                resizeMode="cover"
                style={{height: '100%', width: SIZES.width}}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: -20,
                  width: SIZES.width,
                  height: 50,
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => editOrder('-', arr.menuId, arr.price)}
                  style={{
                    backgroundColor: COLORS.white,
                    width: 50,
                    borderTopLeftRadius: 25,
                    borderBottomLeftRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{...FONTS.body1}}>-</Text>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    width: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{...FONTS.h2}}>{filterItem(arr.menuId)}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => editOrder('+', arr.menuId, arr.price)}
                  style={{
                    backgroundColor: COLORS.white,
                    width: 50,
                    borderTopRightRadius: 25,
                    borderBottomRightRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{...FONTS.body1}}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                width: SIZES.width,
                alignItems: 'center',
                marginTop: 10,
                paddingHorizontal: SIZES.padding * 2,
              }}>
              <Text
                style={{marginVertical: 10, textAlign: 'center', ...FONTS.h2}}>
                {arr.name} - {arr.price.toFixed(2)}
              </Text>
              <Text style={{textAlign: 'center', ...FONTS.body3}}>
                {arr.description}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 5,
                justifyContent: 'center',
              }}>
              <Image
                source={icons.fire}
                resizeMode="contain"
                style={{width: 20, height: 20, marginRight: 10}}
              />
              <Text>{arr.calories.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    );
  };

  const renderDots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width);
    return (
      <View style={{height: 30}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: SIZES.padding,
          }}>
          {restaurant?.menu.map((item, index) => {
            const opacity = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            const dotSize = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [SIZES.base, 10, SIZES.base],
              extrapolate: 'clamp',
            });
            const dotColor = dotPosition.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [COLORS.secondary, COLORS.primary, COLORS.secondary],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={`icons${index}`}
                opacity={opacity}
                style={{
                  borderRadius: SIZES.radius,
                  backgroundColor: dotColor,
                  height: dotSize,
                  width: dotSize,
                  marginHorizontal: 6,
                }}></Animated.View>
            );
          })}
        </View>
      </View>
    );
  };
  const renderOrder = () => {
    const calulateBill = () => {
      if (orderItem.length > 0) {
        const total=orderItem.reduce((a, b) => {
          return a + b.totalPrice;
        }, 0);
        return total.toFixed(2)
      } else {
        return 0;
      }
    };
    const calulateItems = () => {
      if (orderItem.length > 0) {
        return orderItem.reduce((a, b) => {
          return a + b.items;
        }, 0);
      } else {
        return 0;
      }
    };
    return (
      <View>
        {renderDots()}
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: SIZES.padding * 3,
              paddingVertical: SIZES.padding * 2,
              borderBottomColor: COLORS.lightGray2,
              borderBottomWidth: 1,
            }}>
            <Text style={{...FONTS.h3}}>{calulateItems()} items</Text>
            <Text style={{...FONTS.h3}}>${calulateBill()}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: SIZES.padding * 3,
              paddingVertical: SIZES.padding * 2,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.pin}
                resizeMode="contain"
                style={{width: 20, height: 20, tintColor: COLORS.darkgray}}
              />
              <Text style={{marginLeft: 5, ...FONTS.h3}}>Location</Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Image
                source={icons.master_card}
                resizeMode="contain"
                style={{width: 20, height: 20, tintColor: COLORS.darkgray}}
              />
              <Text style={{marginLeft: 5, ...FONTS.h3}}>8888</Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: SIZES.padding,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={()=>{
                navigation.navigate('OrderDelivery',{currentLocation,restaurant})
              }}
              style={{
                backgroundColor: COLORS.primary,
                width: SIZES.width * 0.9,
                padding: SIZES.padding,
                borderRadius: SIZES.radius,
                alignItems: 'center',
              }}>
              <Text style={{color: COLORS.white, ...FONTS.h2}}>Order</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isIphoneX && (
          <View
            style={{
              position: 'absolute',
              bottom: -34,
              left: 0,
              right: 0,
              height: 34,
              backgroundColor: COLORS.white,
            }}></View>
        )}
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderScrollView()}
      {renderOrder()}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray2,
  },
});
export default Restaurant;
